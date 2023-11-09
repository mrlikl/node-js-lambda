import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { LambdaStack } from './lambda-stack'

export class LambdaStage extends cdk.Stage {
  constructor (scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props)

    const dbStack = new LambdaStack(this, 'NodeLambdaStack')
  }
}
