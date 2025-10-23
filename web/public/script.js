let lastIpAddressXml = ""; // сохраняем блок IPAddress для последующего PUT

function formatXml(xml) {
  const PADDING = "  ";
  const reg = /(>)(<)(\/*)/g;
  let formatted = "";
  let pad = 0;

  xml = xml.replace(reg, "$1\r\n$2$3");
  xml.split("\r\n").forEach((node) => {
    let indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/)) {
      if (pad !== 0) pad -= 1;
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }

    formatted += PADDING.repeat(pad) + node + "\r\n";
    pad += indent;
  });

  return formatted.trim();
}

async function getNetwork() {
  const ip = document.getElementById("cameraIp").value.trim();
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value;
  const url = `/proxy/network?ip=${ip}&user=${user}&pass=${pass}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(`${user}:${pass}`),
      },
    });

    const text = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");

    const ipAddressNode = xmlDoc.querySelector(
      "InterfaceList > Interface > IPAddress",
    );
    if (!ipAddressNode) {
      document.getElementById("responseBox").textContent =
        "Не удалось найти IPAddress в ответе.";
      return;
    }

    lastIpAddressXml = ipAddressNode.outerHTML;

    // 🧠 Автозаполнение формы
    const getText = (tag) =>
      ipAddressNode.querySelector(tag)?.textContent.trim() || "";

    document.getElementById("ipAddress").value = getText("ipAddress");
    document.getElementById("subnetMask").value = getText("SubnetMask");
    document.getElementById("gateway").value = getText("Gateway");
    document.getElementById("ipAdaptive").value = getText("IPAdaptive");

    document.getElementById("responseBox").textContent =
      `GET ${url}\nСтатус: ${res.status}\n\n${formatXml(lastIpAddressXml)}`;
  } catch (err) {
    document.getElementById("responseBox").textContent = `Ошибка: ${err}`;
  }
}

async function setNetwork() {
  const camIp = document.getElementById("cameraIp").value.trim();
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value;
  const url = `/proxy/network?ip=${camIp}&user=${user}&pass=${pass}`;

  if (!lastIpAddressXml) {
    document.getElementById("responseBox").textContent =
      "Нет данных IPAddress для отправки.";
    return;
  }

  // 🧠 Получаем значения из формы
  const ipAddress = document.getElementById("ipAddress")?.value.trim();
  const subnetMask = document.getElementById("subnetMask")?.value.trim();
  const gateway = document.getElementById("gateway")?.value.trim();
  const ipAdaptive = document.getElementById("ipAdaptive")?.value;

  // 🛠️ Парсим lastIpAddressXml и обновляем поля
  const parser = new DOMParser();
  const ipDoc = parser.parseFromString(lastIpAddressXml, "application/xml");

  const update = (selector, value) => {
    const node = ipDoc.querySelector(selector);
    if (node && value) node.textContent = value;
  };

  update("ipAddress", ipAddress);
  update("SubnetMask", subnetMask);
  update("Gateway", gateway);
  update("IPAdaptive", ipAdaptive);

  // 🔁 Сериализуем обратно
  const serializer = new XMLSerializer();
  const updatedIpXml = serializer.serializeToString(ipDoc.documentElement);

  const xml = `
<Network version="1.0" xmlns="">
  <InterfaceList>
    <Interface>
      <ID>1</ID>
      ${updatedIpXml}
    </Interface>
  </InterfaceList>
</Network>`.trim();

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + btoa(`${user}:${pass}`),
        "Content-Type": "application/xml",
      },
      body: xml,
    });
    const text = await res.text();
    document.getElementById("responseBox").textContent =
      `PUT ${url}\nСтатус: ${res.status}\n\n${text || "(пустой ответ)"}`;
  } catch (err) {
    document.getElementById("responseBox").textContent = `Ошибка: ${err}`;
  }
}
