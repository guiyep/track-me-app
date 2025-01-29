export const handler = () => {
  return 'TODO';
};

// import { SQSEvent, SQSHandler } from 'aws-lambda'; // Import types from @types/aws-lambda

// // Define the type of your SQS message body
// interface OrderMessage {
//   orderId: string;
//   amount: number;
// }

// export const handler: SQSHandler = async (event: SQSEvent) => {
//   console.log('Received event:', JSON.stringify(event, null, 2));

//   // Process each SQS message in the event
//   for (const record of event.Records) {
//     const messageBody: OrderMessage = JSON.parse(record.body); // Type cast the message body

//     console.log('Message Body:', messageBody);

//     try {
//       // Add your message processing logic here
//       console.log(
//         `Processing order ${messageBody.orderId} for amount ${messageBody.amount}`,
//       );

//       // Simulating failure for testing DLQ
//       if (Math.random() < 0.5) {
//         throw new Error('Simulated processing error');
//       }
//     } catch (error) {
//       console.error('Error processing message:', error);
//       // Lambda will retry the message automatically up to the maxReceiveCount
//       throw error; // Throwing error forces Lambda to consider it a failure and retry.
//     }
//   }

//   // Return a success response
//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       message: 'Processed SQS message(s)',
//     }),
//   };
// };
