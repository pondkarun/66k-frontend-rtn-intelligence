pipeline {
    agent any
    parameters {
        String(defaultValue: '', description: '', name: 'VERSION', trim: true)
    }
    stages {
        stage('Build & Push') {
            agent { label "dev1"}
            steps{
                script{
                    cleanWs()
                        step([
                                $class: 'DockerBuilderPublisher',
                                cleanImages: false,
                                cleanupWithJenkinsJobDelete: false,
                                cloud: '',
                                dockerFileDirectory: 'Dockerfile',
                                fromRegistry: [],
                                pushCredentialsId: 'docker',
                                pushOnSuccess: true,
                                tagsString: "cmtttbrother/66k-rtn-intelligence:$VERSION"
                            ])
                    cleanWs()
                }
            }
        }
    }
}