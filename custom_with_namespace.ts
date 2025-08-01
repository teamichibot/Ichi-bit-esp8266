
namespace mqttSerial {
    let mqttTopik = ""
    let mqttPesan = ""
    let mqttCallback: Action

    //% block="hubungkan MQTT SSID: %ssid PASS: %pass Broker: %broker"
    //% weight=90
    export function hubungkanMQTT(ssid: string, pass: string, broker: string): void {
        serial.redirect(SerialPin.P12, SerialPin.P8, BaudRate.BaudRate115200)
        serial.redirectToUSB()
        basic.pause(500)
        serial.writeLine("SSID:" + ssid)
        serial.writeLine("PASS:" + pass)
        serial.writeLine("MQTT:" + broker)
        basic.pause(1000)
    }

    //% block="subscribe topik %topik"
    //% weight=80
    export function subscribeTopik(topik: string): void {
        serial.writeLine("SUB:" + topik)
    }

    //% block="publish ke %topik dengan data %data"
    //% weight=70
    export function kirimData(topik: string, data: string): void {
        serial.writeLine("PUB:" + topik + ":" + data)
    }

    //% block="saat menerima pesan dari %topik"
    //% draggableParameters
    //% weight=60
    export function onTerimaPesan(topik: string, handler: (pesan: string) => void): void {
        mqttCallback = () => {
            handler(mqttPesan)
        }
        mqttTopik = topik

        serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
            let res = serial.readString().split(":")
            if (res.length >= 2) {
                let topic = res[0]
                let message = res[1]
                if (topic == mqttTopik) {
                    mqttPesan = message
                    mqttCallback()
                }
            }
        })
    }
}
