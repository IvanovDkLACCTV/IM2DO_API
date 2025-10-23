### Получение текущих параметров через Postman

1. **Метод запроса**: GET

2. **URL**: http://192.168.1.51/Network
3. **Авторизация**: Во вкладке "Authorization" выберите "Basic Auth" и введите логин/пароль от камеры username:admin, password:. Чтобы изменить ipAddress, SubnetMask и IPAdaptive вместе, нужно отправить PUT-запрос с обновленными значениями всех этих параметров.

### 📝 Настройка запроса в Postman
1. **Метод запроса**: PUT
2. **URL**: http://192.168.1.51/Network
3. **Авторизация**: Во вкладке "Authorization" выберите "Basic Auth" и введите логин/пароль от камеры
4. **Заголовки**: Во вкладке "Headers" добавьте:
   - Key: Content-Type
   - Value: application/xml

### 📄 Тело запроса (Body)

Во вкладке "Body" выберите "raw" и вставьте этот XML, подставив нужные вам значения:

```XML
<Network version="1.0" xmlns="">
    <InterfaceList>
        <Interface>
            <ID>1</ID>
            <IPAddress>
                <ipVersion>V4</ipVersion>
                <ipAddress>192.168.1.100</ipAddress>
                <SubnetMask>255.255.255.0</SubnetMask>
                <Gateway>192.168.1.203</Gateway>
                <MacAddress>5a:5a:00:84:41:8b</MacAddress>
                <IPAdaptive>close</IPAdaptive>
                <DHCP>
                    <Enable>false</Enable>
                </DHCP>
                <DNS>
                    <Enable>false</Enable>
                    <PrimaryDNS>202.96.134.133</PrimaryDNS>
                    <SecondaryDNS>202.96.128.166</SecondaryDNS>
                </DNS>
            </IPAddress>
        </Interface>
    </InterfaceList>
</Network>
```

### 🔧 Что нужно изменить:

- **<ipAddress>** - замените 192.168.1.51 на нужный IP-адрес
- **<SubnetMask>** - замените 255.255.255.0 на нужную маску подсети
- **<IPAdaptive>** - оставьте close для статического IP или open для автоматической настройки
- **<Gateway>** - при необходимости также измените шлюз

### ⚠️ Важные предупреждения:
1. **Будьте осторожны с IP-адресом** - если вы измените адрес на недоступный в вашей сети, вы можете потерять соединение с камерой!
2. **Соблюдайте интервалы** - делайте паузу 3-5 секунд между запросами к сетевым настройкам
3. **После изменения IP-адреса** вам нужно будет обновить URL в Postman на новый адрес для последующих запросов

После успешного выполнения запроса вы получите пустой ответ со статусом 200.
