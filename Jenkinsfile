pipeline {
    agent any

    environment {
        APP_NAME       = 'siemens-dashboard'
        CONTAINER_NAME = 'siemens_energy_dashboard'
        HOST_PORT      = '8205'
        IMAGE_TAG      = "${BUILD_NUMBER}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 15, unit: 'MINUTES')
    }

    stages {
        stage('1. Code Validation & Build') {
            steps {
                echo "================================================"
                echo "Checking repository integrity & building bundle"
                echo "================================================"
                sh 'test -f package.json || (echo "Error: package.json missing!" && exit 1)'
                sh 'test -f Dockerfile || (echo "Error: Dockerfile missing!" && exit 1)'
                sh 'npm ci || npm install'
                sh 'npm run build'
                echo "Validation and build passed successfully."
            }
        }

        stage('2. Build Docker Image') {
            steps {
                echo "Building Docker image ${APP_NAME}:${IMAGE_TAG}..."
                script {
                    sh "docker build -t ${APP_NAME}:${IMAGE_TAG} -t ${APP_NAME}:latest ."
                }
            }
        }

        stage('3. Deploy Container') {
            steps {
                echo "Deploying container ${CONTAINER_NAME} on port ${HOST_PORT}..."
                script {
                    // Stop and remove previous container instance if running
                    sh """
                        if [ \$(docker ps -a -q -f name=${CONTAINER_NAME}) ]; then
                            echo "Stopping existing container..."
                            docker stop ${CONTAINER_NAME} || true
                            docker rm ${CONTAINER_NAME} || true
                        fi
                    """
                    // Start new container instance
                    sh """
                        docker run -d \\
                            --name ${CONTAINER_NAME} \\
                            --restart always \\
                            -p ${HOST_PORT}:80 \\
                            ${APP_NAME}:latest
                    """
                }
            }
        }

        stage('4. Health Check') {
            steps {
                echo "Verifying application availability..."
                script {
                    sh """
                        sleep 3
                        if docker ps | grep -q ${CONTAINER_NAME}; then
                            echo "Container ${CONTAINER_NAME} is healthy and running!"
                        else
                            echo "Error: Container failed to start!"
                            docker logs ${CONTAINER_NAME}
                            exit 1
                        fi
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up dangling images..."
            sh 'docker image prune -f || true'
        }
        success {
            echo "================================================"
            echo "SUCCESS: Siemens Energy Dashboard deployed successfully!"
            echo "================================================"
        }
        failure {
            echo "================================================"
            echo "FAILURE: Deployment failed! Check logs above."
            echo "================================================"
        }
    }
}
