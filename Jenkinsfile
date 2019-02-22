node {
   echo 'Begin git '
   git branch: 'template', credentialsId: 'emiliano.veloso', url: 'https://emiliano.veloso@innersource.accenture.com/scm/aip_es/edge_mm_iot_iu.git'
   echo 'Finish code'
   
   //def customImage = docker.build("edgemm:${env.BUILD_ID}")
   docker.withServer('tcp://10.0.2.12:4243') {
      
        sh 'docker stop edge_ui  && docker rm edge_ui'
        sh  'docker build . -t edgemm:latest && docker run -d --name edge_ui -p 4200:4200 edgemm && docker ps | grep edge_ui'
       
    //docker.image('edgemm:latest').withRun('--name edge_ui -p 4200:4200') {
echo 'End docker'        
   
    }
  
}


  // sh 'sshpass -p bRuRaz3+pema ssh -o StrictHostKeyChecking=no mmadmin@10.0.2.12 "cd /home/mmadmin/emi/edge_mm_iot_iu && docker stop edge_ui  && docker rm edge_ui && docker build . -t edgemm:latest && docker run -d --name edge_ui -p 4200:4200 edgemm && docker ps | grep edge_ui"'
