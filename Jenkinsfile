pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        retry(2)
        disableConcurrentBuilds()
    }

    environment {
        APP_NAME       = 'siemens-energy-dashboard'
        IMAGE_TAG      = "${env.BUILD_NUMBER ?: 'latest'}"
        CONTAINER_PORT = '3000'
    }

    stages {
        stage('Checkout & Info') {
            steps {
                echo "================================================================"
                echo " Starting CI/CD Pipeline for Siemens Energy Dashboard"
                echo " Build Number: ${env.BUILD_NUMBER}"
                echo " Branch: ${env.BRANCH_NAME ?: 'main'}"
                echo " Workspace: ${env.WORKSPACE}"
                echo "================================================================"
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing npm dependencies..."
                sh 'npm ci || npm install'
            }
        }

        stage('Build & Code Audit') {
            steps {
                echo "Compiling production bundle via Vite..."
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker Image ${APP_NAME}:${IMAGE_TAG}..."
                sh "docker build -t ${APP_NAME}:${IMAGE_TAG} -t ${APP_NAME}:latest ."
            }
        }

        stage('Docker Integration Test') {
            steps {
                echo "Running temporary container health verification..."
                script {
                    sh "docker run -d --name ${APP_NAME}-test -p 8085:80 ${APP_NAME}:${IMAGE_TAG}"
                    sleep 5
                    sh "curl -f http://localhost:8085/ || wget --quiet --tries=1 --spider http://localhost:8085/"
                    sh "docker rm -f ${APP_NAME}-test"
                }
            }
        }

        stage('Deploy Container') {
            steps {
                echo "Deploying production container..."
                script {
                    sh "docker-compose up -d --build"
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up temporary test containers..."
            sh "docker rm -f ${APP_NAME}-test 2>/dev/null || true"
        }
        success {
            echo "SUCCESS: Siemens Energy Dashboard successfully built, verified, and containerized!"
        }
        failure {
            echo "FAILURE: Build or test failed in pipeline."
        }
    }
}
