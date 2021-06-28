#include <ArduinoJson.h>

/*#include <WiFiEsp.h>
#include <WiFiEspClient.h>
#include <WiFiEspServer.h>
#include <WiFiEspUdp.h>*/

/*
 태양 전지판 -> 배터리로 들어가는 Relay : 12번, ACS712 : A0(14번)
 배터리 -> 기기들로 들어가는 Relay : 8,9번, ACS712 : A1(15번)
 배터리 잔량 측정하는 ACS : A2(16번)
*/
#include "WiFiEsp.h"



// Emulate Serial1 on pins 6/7 if not present

#ifndef HAVE_HWSERIAL1

#endif

#include "SoftwareSerial.h"

SoftwareSerial Serial1(2, 3); // RX, TX


char ssid[] = "wlgkqhekwltkd";            // your network SSID (name)

char pass[] = "qkqhcksdud1!";        // your network password

int status = WL_IDLE_STATUS;     // the Wifi radio's status

char server[] = "116.42.123.180";



// Initialize the Ethernet client object
WiFiEspClient client;

int pk = 1;

long relay_CtoB = 12;
const int analogIn_CtoB = A0;

long relay_BtoA_1 = 8;
long relay_BtoA_2 = 9;
const int analogIn_BtoA = A1;

const int analogIn_BtoB = A2;

boolean product_1 = true;//서버에서 받아오는 status 값1
boolean product_2 = true;//서버에서 받아오는 status 값2
boolean suncharge = true;

int mVperAmp = 185;
int RawValue= 0;
int ACSoffset = 2500;
double Voltage = 0;
double Amps = 0;
double elec_total_s = 0;
double elec_total = 0;

void setup() {
  
  // put your setup code here, to run once:
  pinMode(relay_CtoB,OUTPUT);
  pinMode(relay_BtoA_1,OUTPUT);
  pinMode(relay_BtoA_2,OUTPUT);
  Serial.begin(9600);
  Serial1.begin(9600);
  // initialize ESP module

  WiFi.init(&Serial1);

  // check for the presence of the shield

  if (WiFi.status() == WL_NO_SHIELD) {

    Serial.println("WiFi shield not present");

    // don't continue

    while (true);

  }



  // attempt to connect to WiFi network

  while ( status != WL_CONNECTED) {

    Serial.print("Attempting to connect to WPA SSID: ");

    Serial.println(ssid);

    // Connect to WPA/WPA2 network

    status = WiFi.begin(ssid, pass);

  }

  // you're connected now, so print out the data

  Serial.println("You're connected to the network");

  printWifiStatus();

}

void loop() {
  
  //태양광 발전량 계산
  RawValue = analogRead(analogIn_CtoB);
  Voltage = (RawValue / 1024.0) * 5000; // Gets you mV
  Amps = ((Voltage - ACSoffset) / mVperAmp);
  Serial.print("Raw Value(sunlight) = " ); // shows pre-scaled value 
  Serial.print(RawValue); 
  Serial.print("\t mV(sunlight) = "); // shows the voltage measured 
  Serial.print(Voltage,3); // the '3' after voltage allows you to display 3 digits after decimal point
  Serial.print("\t Amps(sunlight) = "); // shows the voltage measured 
  Serial.println(Amps,3); // the '3' after voltage allows you to display 3 digits after decimal point

  if(Amps<0)
    elec_total_s = (-1)*Amps;
  else
    elec_total_s = Amps;
  Serial.print("(sunlight) : ");
  Serial.println(elec_total_s);


  //기기 제어
  if(suncharge == true)
  {
    digitalWrite(relay_CtoB,LOW);
  }
  else
  {
    digitalWrite(relay_CtoB,HIGH);
  }
  if(product_1 == true)
  {
    digitalWrite(relay_BtoA_1,LOW);
    Serial.println("product1 ON");
  }
  else{
    digitalWrite(relay_BtoA_1,HIGH);
  }
  
  if(product_2 == true)
  {
      digitalWrite(relay_BtoA_2,LOW);
    Serial.println("product2 ON");
  }
  else{
    digitalWrite(relay_BtoA_2,HIGH);
  }
  //전력 사용량
  
  RawValue = analogRead(analogIn_BtoA);
  Voltage = (RawValue / 1024.0) * 5000; // Gets you mV
  Amps = ((Voltage - ACSoffset) / mVperAmp);
  
  Serial.print("Raw Value = " ); // shows pre-scaled value 
  Serial.print(RawValue); 
  Serial.print("\t mV = "); // shows the voltage measured 
  Serial.print(Voltage,3); // the '3' after voltage allows you to display 3 digits after decimal point
  Serial.print("\t Amps = "); // shows the voltage measured 
  Serial.println(Amps,3); // the '3' after voltage allows you to display 3 digits after decimal point

  if(Amps<0)
    elec_total = (-1)*Amps;
  else
    elec_total = Amps;

  Serial.println(elec_total);

  //배터리 전력량
  RawValue = analogRead(analogIn_BtoB);
  Voltage = (RawValue / 1024.0) * 5000; // Gets you mV
  Amps = ((Voltage - ACSoffset) / mVperAmp);
  Serial.print("Raw Value = " ); // shows pre-scaled value 
  Serial.print(RawValue); 
  Serial.print("\t mV = "); // shows the voltage measured 
  Serial.print(Voltage,3); // the '3' after voltage allows you to display 3 digits after decimal point
  Serial.print("\t Amps = "); // shows the voltage measured 
  Serial.println(Amps,3); // the '3' after voltage allows you to display 3 digits after decimal point
  
    
  if(Amps<0)
  {
    Amps = Amps*(-1);
  }
  
  double battery_rest = ((Voltage/1000)*(elec_total-elec_total_s))/100.0;

  Serial.println(battery_rest,6);
  
  Serial.println();

  Serial.println("Starting connection to server...");

  //웹서버와 통신
  if (client.connect(server, 80)) {

    Serial.println("Connected to server");
    // Make a HTTP request

    client.println(String("GET /arduino/api/local/") + pk + String("/") + elec_total + String("/") + battery_rest + String("/") + elec_total_s + " HTTP/1.1");
    client.println();

  }

  

  int lines_received = 0;
  StaticJsonDocument<200> doc;
  String jsonStr = "";
  while (client.available()) {
    String line = client.readStringUntil('\r\n');
    if(lines_received == 18){
      DeserializationError error = deserializeJson(doc, line);
    }
    lines_received++;
  }
/*
  if(jsonStr.length()>0){
    Serial.println("from server: "+jsonStr);
  }*/
  relay_CtoB = doc[0]["port"];
  relay_BtoA_1 = doc[1]["port"];
  relay_BtoA_2 = doc[2]["port"];
  suncharge = doc[0]["status"];
  product_1 = doc[1]["status"];
  product_2 = doc[2]["status"];
  client.flush();
  client.stop();

  delay(500);
}


void printWifiStatus()

{

  // print the SSID of the network you're attached to

  Serial.print("SSID: ");

  Serial.println(WiFi.SSID());



  // print your WiFi shield's IP address

  IPAddress ip = WiFi.localIP();

  Serial.print("IP Address: ");

  Serial.println(ip);



  // print the received signal strength
/*
  long rssi = WiFi.RSSI();

  Serial.print("Signal strength (RSSI):");

  Serial.print(rssi);

  Serial.println(" dBm");*/

}
