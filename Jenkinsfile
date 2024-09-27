pipeline {
    agent {
       label 'linux'
       docker {
                 image 'docker:latest'
                 args '-v /var/run/docker.sock:/var/run/docker.sock'
              }
           }

    tools {
        maven 'mvn'
    }

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub'
        SONARQUBE_CREDENTIALS = 'squ_43f54098f6a91e875e7952d697a1ea6b12770b91'
        TAG_VERSION = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/kettaabii/ci-cd-using-jenkins-.git'
            }
        }

        stage('Build & Test Microservices') {
            parallel {
                stage('Build & Test user-service') {
                    agent any
                    steps {
                        dir('user-service') {
                            sh 'mvn clean '
                            sh 'mvn validate'
                        }

                    }
                }

                stage('Build & Test project-service') {
                    agent any
                    steps {
                        dir('project-service') {
                            sh 'mvn clean package'
                        }
                    }
                }

                stage('Build & Test task-service') {
                    agent any
                    steps {
                        dir('task-service') {
                            sh 'mvn clean package'
                        }
                    }
                }

                stage('Build & Test resource-service') {
                    agent any
                    steps {
                        dir('resource-service') {
                            sh 'mvn clean package'
                        }
                    }
                }

                stage('Build & Package api-gateway-service') {
                    agent any
                    steps {
                        dir('api-gateway-service') {
                            sh 'mvn clean package'
                        }
                    }
                }

                stage('Build & Package eureka-server') {
                    agent any
                    steps {
                        dir('eureka-server') {
                            sh 'mvn clean package'
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            agent any
            steps {
                script {
                    def scannerHome = tool 'SonarQubeScanner'

                    def services = ['user-service', 'project-service', 'task-service', 'resource-service', 'api-gateway-service', 'eureka-server']

                    services.each { service ->
                        dir(service) {
                            sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=${service} -Dsonar.sources=. -Dsonar.token=${SONARQUBE_CREDENTIALS} -Dsonar.java.binaries=target/classes"
                        }
                    }
                }
            }
        }

        stage('Build Docker Images & Push') {
            steps {
                script {
                    def services = ['user-service', 'project-service', 'task-service', 'resource-service', 'api-gateway-service', 'eureka-server']

                    services.each { service ->
                        dir(service) {
                            def imageName = "meleke/${service}:${TAG_VERSION}"
                            sh "echo 'Building ${imageName}'"
                            sh "docker build -t ${imageName} . || (echo 'Docker build failed for ${service}'; docker build -t ${imageName} . --no-cache --progress=plain; exit 1)"

                            withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                                sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                                sh "docker push ${imageName} || (echo 'Docker push failed for ${service}'; exit 1)"
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout'
            cleanWs()
        }
    }
}