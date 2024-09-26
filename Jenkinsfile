pipeline {
    agent { label 'linux' }

    tools {
        maven 'mvn'
    }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('docker-hub')
        SONARQUBE_CREDENTIALS = 'sonar-qube'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/kettaabii/MicroservicesProject.git'
            }
        }

//ts


        stage('Build & Test Microservices') {
            parallel {
                stage('Build & Test user-service') {
                    agent any
                    steps {
                        dir('user-service') {
                            sh 'mvn clean package'
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

                    dir('user-service') {
                        sh "${scannerHome}/bin/sonar-scanner  -Dsonar.projectKey=user-service -Dsonar.sources=. -Dsonar.login=${SONARQUBE_CREDENTIALS} -Dsonar.java.binaries=target/classes"
                    }
                    dir('project-service') {
                        sh "${scannerHome}/bin/sonar-scanner   -Dsonar.projectKey=project-service -Dsonar.sources=. -Dsonar.login=${SONARQUBE_CREDENTIALS} -Dsonar.java.binaries=target/classes"
                    }
                    dir('task-service') {
                        sh "${scannerHome}/bin/sonar-scanner  -Dsonar.projectKey=task-service -Dsonar.sources=. -Dsonar.login=${SONARQUBE_CREDENTIALS} -Dsonar.java.binaries=target/classes"
                    }
                    dir('resource-service') {
                        sh "${scannerHome}/bin/sonar-scanner  -Dsonar.projectKey=resource-service -Dsonar.sources=. -Dsonar.login=${SONARQUBE_CREDENTIALS} -Dsonar.java.binaries=target/classes"
                    }
                    dir('api-gateway-service') {
                        sh "${scannerHome}/bin/sonar-scanner  -Dsonar.projectKey=api-gateway-service -Dsonar.sources=. -Dsonar.login=${SONARQUBE_CREDENTIALS} -Dsonar.java.binaries=target/classes"
                    }
                    dir('eureka-server') {
                        sh "${scannerHome}/bin/sonar-scanner  -Dsonar.projectKey=eureka-server -Dsonar.sources=. -Dsonar.login=${SONARQUBE_CREDENTIALS} -Dsonar.java.binaries=target/classes"
                    }
                }
            }
        }

        stage('Build Docker Images & Push') {
            parallel {
                stage('Build Docker & Push for user-service') {
                    agent any
                    steps {
                        dir('user-service') {
                            script {
                                def dockerImage = docker.build("meleke/user-service:${env.TAG_VERSION ?: 'latest'}")
                                docker.withRegistry('https://index.docker.io/v1/', 'DOCKERHUB_CREDENTIALS') {
                                    dockerImage.push()
                                }
                            }
                        }
                    }
                }

                stage('Build Docker & Push for project-service') {
                    agent any
                    steps {
                        dir('project-service') {
                            script {
                                def dockerImage = docker.build("meleke/project-service:${env.TAG_VERSION ?: 'latest'}")
                                docker.withRegistry('https://index.docker.io/v1/', 'DOCKERHUB_CREDENTIALS') {
                                    dockerImage.push()
                                }
                            }
                        }
                    }
                }

                stage('Build Docker & Push for task-service') {
                    agent any
                    steps {
                        dir('task-service') {
                            script {
                                def dockerImage = docker.build("meleke/task-service:${env.TAG_VERSION ?: 'latest'}")
                                docker.withRegistry('https://index.docker.io/v1/', 'DOCKERHUB_CREDENTIALS') {
                                    dockerImage.push()
                                }
                            }
                        }
                    }
                }

                stage('Build Docker & Push for resource-service') {
                    agent any
                    steps {
                        dir('resource-service') {
                            script {
                                def dockerImage = docker.build("meleke/resource-service:${env.TAG_VERSION ?: 'latest'}")
                                docker.withRegistry('https://index.docker.io/v1/', 'DOCKERHUB_CREDENTIALS') {
                                    dockerImage.push()
                                }
                            }
                        }
                    }
                }

                stage('Build Docker & Push for api-gateway-service') {
                    agent any
                    steps {
                        dir('api-gateway-service') {
                            script {
                                def dockerImage = docker.build("meleke/api-gateway-service:${env.TAG_VERSION ?: 'latest'}")
                                docker.withRegistry('https://index.docker.io/v1/', 'DOCKERHUB_CREDENTIALS') {
                                    dockerImage.push()
                                }
                            }
                        }
                    }
                }

                stage('Build Docker & Push for eureka-server') {
                    agent any
                    steps {
                        dir('eureka-server') {
                            script {
                                def dockerImage = docker.build("meleke/eureka-server:${env.TAG_VERSION ?: 'latest'}")
                                docker.withRegistry('https://index.docker.io/v1/', 'DOCKERHUB_CREDENTIALS') {
                                    dockerImage.push()
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            // Clean up steps
            cleanWs()
        }
    }
}