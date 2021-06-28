#include <ArduinoJson.h>

#include <WiFiEsp.h>
#include <WiFiEspClient.h>
#include <WiFiEspServer.h>
#include <WiFiEspUdp.h>

// Emulate Serial1 on pins 6/7 if not present

#ifndef HAVE_HWSERIAL1

#endif

#include "SoftwareSerial.h"

SoftwareSerial Serial1(2, 3); // RX, TX

boolean start = false;

long relay1_2 = 13;
const int analogIn1_2 = A0;

long relay2_1 = 12;
const int analogIn2_1 = A1;

int cnt=0;
int leng = 0;
int mVperAmp = 185;
int RawValue= 0;
int ACSoffset = 2500;
double Voltage = 0;
double Amps = 0;
double speeds = 0;
double times = 0;
double send_amount = 0;
double amount = 0;
double total_Amp = 0;
long flag = 0; // input값
int seller = 0;
  int buyer = 0;

char ssid[] = "wlgkqhekwltkd";            // your network SSID (name)

char pass[] = "qkqhcksdud1!";        // your network password

int status = WL_IDLE_STATUS;     // the Wifi radio's status

char server[] = "116.42.123.180";

// Initialize the Ethernet client object

WiFiEspClient client;


void setup() {
  Serial.begin(9600);
  Serial1.begin(9600);
  // initialize ESP module
  WiFi.init(&Serial1);
  pinMode(relay2_1,OUTPUT);
  pinMode(relay1_2,OUTPUT);

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
  if(cnt == 0){
    cnt++;
    digitalWrite(relay1_2,HIGH);
    digitalWrite(relay2_1,HIGH);
  }
  if(!start){
    client.connect(server, 80);

    Serial.println("Connected to server");

    // Make a HTTP request
    client.println("GET /arduino/api/external/0/0/0 HTTP/1.1");
    Serial.println("what?");
    client.println();
 /* 
  while (client.available()) {

    char c = client.read();

    Serial.write(c);

  }*/
  
  int lines_received = 0;
  String line ="";
  StaticJsonDocument<200> doc;
  
  while (client.available()) {
    String line = client.readStringUntil('\r\n');
    if(lines_received == 18){
      Serial.println("fuck");
      leng = line.length();
      Serial.println(line); 
      DeserializationError error = deserializeJson(doc, line);
    seller = doc["seller"];
    buyer = doc["buyer"];
    amount = doc["amount"];
    send_amount = doc["amount_send"];
    }
    lines_received++;
  }
  if(flag == 0)
  {
    digitalWrite(relay1_2,HIGH);
    digitalWrite(relay2_1,HIGH);
  }
  if(amount == 0){
    start = false;
  }
  else {
    start = true;
    if(seller == 1 && buyer == 2)
    {
      flag = relay1_2;
    }
    if(seller == 2 && buyer == 1)
    {
      flag = relay2_1;
    }
  }
  client.flush();
  client.stop();
 }
  else
  {
    if(flag == relay1_2) {
      if(send_amount >= amount)
      {
        Serial.println("I'm Done!!!!");
        flag = 0;
        start = false;
      } else {
        digitalWrite(relay1_2,LOW);
        RawValue = analogRead(analogIn1_2);
        Voltage = (RawValue / 1024.0) * 5000; // Gets you mV
        Amps = ((Voltage - ACSoffset) / mVperAmp);
        Serial.print("Raw Value = " ); // shows pre-scaled value 
        Serial.print(RawValue); 
        Serial.print("\t mV = "); // shows the voltage measured 
        Serial.print(Voltage,3); // the '3' after voltage allows you to display 3 digits after decimal point
        Serial.print("\t Amps = "); // shows the voltage measured 
        Serial.println(Amps,3); // the '3' after voltage allows you to display 3 digits after decimal point
        
        total_Amp = Amps;

        if(Amps < 0)
          Amps = Amps*(-1);
        
        
        send_amount += (Voltage/1000)*Amps;
        speeds = (Voltage/1000)*Amps;
        times = (amount-send_amount)/((Voltage/1000)*Amps);
        Serial.print("total = ");
        Serial.print(send_amount);
        Serial.print("\t speed = ");
        Serial.print((Voltage/1000)*Amps);
        Serial.print("\t 남은 시간 = ");
        Serial.println((amount-send_amount)/((Voltage/1000)*Amps));
        client.flush();
        client.stop();
      }
    } else if(flag == relay2_1) {
      if(send_amount >= amount)
      {
        Serial.println("I'm Done!!!!");
        flag = 0;
        start = false;
      } else {
        digitalWrite(relay2_1,LOW);
        RawValue = analogRead(analogIn2_1);
        Voltage = (RawValue / 1024.0) * 5000; // Gets you mV
        Amps = ((Voltage - ACSoffset) / mVperAmp);
        Serial.print("Raw Value 1 = " ); // shows pre-scaled value 
        Serial.print(RawValue); 
        Serial.print("\t mV 1 = "); // shows the voltage measured 
        Serial.print(Voltage,3); // the '3' after voltage allows you to display 3 digits after decimal point
        Serial.print("\t Amps 1 = "); // shows the voltage measured 
        Serial.println(Amps,3); // the '3' after voltage allows you to display 3 digits after decimal point

        if(Amps < 0)
          Amps = Amps*(-1);
        
        total_Amp = Amps;
        
        while( total_Amp < 0 && send_amount < amount){
          total_Amp = 0;
          Serial.println("connection fail");
          
          RawValue = analogRead(analogIn2_1);
          Voltage = (RawValue / 1024.0) * 5000; // Gets you mV
          Amps = ((Voltage - ACSoffset) / mVperAmp);
          total_Amp += Amps;
          RawValue = analogRead(analogIn2_1);
          Voltage = (RawValue / 1024.0) * 5000; // Gets you mV
          Amps = ((Voltage - ACSoffset) / mVperAmp);
          total_Amp += Amps;
        }

        
        send_amount += (Voltage/1000)*Amps;
        speeds = (Voltage/1000)*Amps;
        times = (amount-send_amount)/((Voltage/1000)*Amps);
        Serial.print("total 1 = ");
        Serial.print(send_amount);
        Serial.print("\t speed 1 = ");
        Serial.print(speeds);
        Serial.print("\t 남은 시간 1 = ");
        Serial.println(times);
        total_Amp = 0;
      }
    }
    
  
    Serial.println();
  
    Serial.println("Starting connection to server...");
  
    // if you get a connection, report back via serial
  
    if (client.connect(server, 80)) {
  
      Serial.println("Connected to server");
  
      // Make a HTTP request
      client.println(String("GET /arduino/api/external/") + send_amount + String("/") + speeds/10.0 + String("/") + times/10.0 + " HTTP/1.1");
      client.println();
  
    }
    client.flush();
    client.stop();
  }
  client.flush();
  client.stop();
  
  delay(1000);
}

void initValue()
{
  mVperAmp = 185;
  RawValue= 0;
  ACSoffset = 2500;
  Voltage = 0;
  Amps = 0;
  send_amount = 0;
  amount = 5;
  return;
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

  long rssi = WiFi.RSSI();

  Serial.print("Signal strength (RSSI):");

  Serial.print(rssi);

  Serial.println(" dBm");

}
