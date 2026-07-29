pipeline {
    agent any

    environment {
        APP_NAME  = 'sample-node-app'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        // Make sure Jenkins (Homebrew LaunchAgent) can find brew-installed tools
        PATH = "/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
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
                        sh -c "npm ci && npm test"
                '''
            }
        }

        stage('Build Image (inside Minikube)') {
            steps {
                sh '''
                    eval $(minikube docker-env)
                    docker build -t ${APP_NAME}:${IMAGE_TAG} .
                    docker tag ${APP_NAME}:${IMAGE_TAG} ${APP_NAME}:latest
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl apply -f k8s/service.yaml
                    kubectl apply -f k8s/deployment.yaml
                    kubectl set image deployment/${APP_NAME} ${APP_NAME}=${APP_NAME}:${IMAGE_TAG}
                    kubectl rollout status deployment/${APP_NAME} --timeout=120s
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                    kubectl get pods -l app=${APP_NAME}
                    kubectl get svc ${APP_NAME}
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
