#!groovy

properties properties: [
    disableConcurrentBuilds(),
    [
        $class: 'BuildDiscarderProperty',
        strategy: [
            $class: 'LogRotator',
            numToKeepStr: '10',
            daysToKeepStr: '7',
            artifactNumToKeepStr: '10',
            artifactDaysToKeepStr: '7'
        ]
    ]
]

node("main") {
    stage("Checkout") {
        checkout scm
    }

    stage("Yarn Install") {
        sh "npm install -g yarn"
        sh "yarn install"
    }

    parallel(
        "Prettier Server": {
            stage("Prettier Server") {
                sh "yarn prettier:server"
            }
        },
        "Prettier Client": {
            stage("Prettier Client") {
                sh "yarn prettier:client"
            }
        },
        "Prettier Judge": {
            stage("Prettier Judge") {
                sh "yarn prettier:judge"
            }
        }
    )

    def serverImage
    def judgeImage

    parallel(
        "Build Server": {
            stage("Build Server") {
                serverImage = docker.build("tunjudge/server:latest", "-f docker/Dockerfile.server .")
            }
        },
        "Build Judge": {
            stage("Build Judge") {
                judgeImage = docker.build("tunjudge/judge:latest", "-f docker/Dockerfile.judge .")
            }
        }
    )

    if (env.BRANCH_NAME == 'main') {
        docker.withRegistry('', 'docker') {
            parallel(
                "Publish Server": {
                    stage("Publish Server") {
                        serverImage.push()
                    }
                },
                "Publish Judge": {
                    stage("Publish Judge") {
                        judgeImage.push()
                    }
                }
            )
        }
    }
}
