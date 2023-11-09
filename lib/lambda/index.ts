import { Handler } from 'aws-lambda'

const handler: Handler = async (event, context) => {
  console.log('EVENT: \n' + JSON.stringify(event, null, 2))
  return context.logStreamName
}

export { handler }