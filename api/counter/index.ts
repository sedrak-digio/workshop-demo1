import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import getDBContainer from "../utils/getDbClient";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
    const response: { [key: string]: any } = { responseMessage }

    try {
        const dbClient = await getDBContainer('Workshop', 'Counters');
        const countersRef = await dbClient.item('brodie-us-east-counter');


        const { resource: counters } = await countersRef.read();
        response.counters = counters;
        
        const counterValue = counters ? counters.counter + 1 : 1;

        if(counters) {
            await countersRef.replace({ id: 'brodie-us-east-counter', counter: counterValue })
        } else {
            await dbClient.items.create({id: 'brodie-us-east-counter', counter: counterValue})
        }
        
        
        response.counterValue = counterValue;

    } catch (e) {
        context.log('HTTP trigger function failed to connect to DB request.', e);
        response.errors = 'error goes here';
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: response
    };

};

export default httpTrigger;