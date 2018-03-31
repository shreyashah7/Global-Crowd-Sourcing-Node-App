# Lab2-shah
CMPE 273 - Lab 2 - Freelancer Application

steps to run freelancer application:

1. clone the repository from- https://shreyashah7@bitbucket.org/shreyashah7/lab-2-freelancerapp-kafka.git

2. for mongoDB:-
	
	Go to %YOUR_SYSTEM_PATH%\mongodb\bin and execute below commands:
		mongod.exe --dbpath %YOUR_SYSTEM_PATH%\mongodb\data\db

3. for kafka node backend:- 
	
	Start zookeeper and kafka first and then create request_topic and response_topic and start server. 
	For windows:
		Go to %YOUR_SYSTEM_PATH%\kafka_2.11-0.9.0.0\bin\windows and execute below commands:
			zookeeper-server-start.bat ../../config/zookeeper.properties
			kafka-server-start.bat ../../config/server.properties	
			kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic request_topic
			kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic response_topic
	
	For linux/mac:
		Go to %YOUR_SYSTEM_PATH%\kafka_2.11-0.9.0.0\bin and execute below commands:
			zookeeper-server-start.sh ../../config/zookeeper.properties
			kafka-server-start.sh ../../config/server.properties	
			kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic request_topic
			kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic response_topic
		
	Go to Lab2-shah\freelancer-app\kafka-back-end and execute below commands:
		npm install
		npm start

4. for node backend:- 
		
	Go to Lab2-shah\freelancer-app\freelancer-app-be and execute below commands:
		npm install
		npm start
	
	For testing, run below command at Lab2-shah\freelancer-app\freelancer-app-be:-
		npm test
	
5. for frontend:- 
	
	Go to Lab2-shah\freelancer-app\freelancer-app-fe and execute below commands:
		npm install
		npm start
	it will open http://localhost:3000/ in chrome
	
	First Register and then login.