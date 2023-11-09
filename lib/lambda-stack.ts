import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as _lambda_node from 'aws-cdk-lib/aws-lambda-nodejs'
import * as _lambda from 'aws-cdk-lib/aws-lambda'
import path = require('path/posix')

export class LambdaStack extends cdk.Stack {
  constructor (scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const rdsSchemaInitializerFunction = new _lambda_node.NodejsFunction(
      this,
      'rds-schema-initializer',
      {
        bundling: {
          minify: true,
          sourceMap: false,
          sourcesContent: false,
          target: 'ES2020'
        },
        runtime: _lambda.Runtime.NODEJS_16_X,
        entry: path.join(__dirname, 'lambda/index.ts')
      }
    )
  }
}
