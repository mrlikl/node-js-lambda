import { Stack, StackProps } from 'aws-cdk-lib'
import { BuildSpec, LinuxBuildImage } from 'aws-cdk-lib/aws-codebuild'
import * as cdk from 'aws-cdk-lib'
import { Repository } from 'aws-cdk-lib/aws-codecommit'
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep
} from 'aws-cdk-lib/pipelines'
import { Construct } from 'constructs'
import { LambdaStage } from './lambda-stage'

export class PipelineStack extends cdk.Stack {
  constructor (scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const repo = Repository.fromRepositoryName(
      this,
      'CodeCommitSource',
      'NewRepo'
    )

    const pipeline = new CodePipeline(this, 'CodePipeline', {
      dockerEnabledForSynth: true,
      cliVersion: '2.100.0',
      codeBuildDefaults: {
        buildEnvironment: {
          buildImage: LinuxBuildImage.STANDARD_7_0
        },
        partialBuildSpec: BuildSpec.fromObject({
          phases: {
            install: {
              'runtime-versions': {
                nodejs: '18'
              },
              commands: ['ls -R']
            }
          }
        })
      },
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.codeCommit(repo, 'main'),
        installCommands: ['npm install -g npm@9.8.1'],
        commands: ['npm ci', 'npx cdk synth', 'npx cdk list','ls -R']
      }),
      selfMutation: false
    })

    const infraCreationWave = pipeline.addWave('InfraCreation')

    infraCreationWave.addStage(new LambdaStage(this, `creation`))
  }
}
