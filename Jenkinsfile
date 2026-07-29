pipeline {
    agent any

    environment {
        APP_NAME  = 'rish-sample-node-app'
        DEPLOYMENT_NAME = 'sample-node-app'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        // Make sure Jenkins (Homebrew LaunchAgent) can find brew-installed tools
        PATH = "PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${env.PATH}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Test') {
            steps {
                sh '''
                    docker run --rm -v "$PWD":/app -w /app node:18-alpine \
                        sh -c "if [ -f package-lock.json ]; then npm ci; else npm install; fi && npm test"
                '''
            }
        }

        stage('Build Image') {
            steps {
                sh '''
                    docker build -t ${APP_NAME}:${IMAGE_TAG} .
                    docker tag ${APP_NAME}:${IMAGE_TAG} ${APP_NAME}:latest
                '''
            }
        }
        stage('Load Image into Minikube') {
            steps {
                sh '''
                    minikube image load ${APP_NAME}:${IMAGE_TAG}
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl apply -f service.yaml
                    kubectl apply -f deployment.yaml
                    kubectl set image deployment/${DEPLOYMENT_NAME} ${DEPLOYMENT_NAME}=${APP_NAME}:${IMAGE_TAG}
                    kubectl rollout status deployment/${DEPLOYMENT_NAME} --timeout=120s
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                    kubectl get pods -l app=${DEPLOYMENT_NAME}
                    kubectl get svc ${DEPLOYMENT_NAME}
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployed ${APP_NAME}:${IMAGE_TAG} to Minikube successfully!"
        }
        failure {
            echo "❌ Pipeline failed — check the stage logs above."
        }
    }
}
