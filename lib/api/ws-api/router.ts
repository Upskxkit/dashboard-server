import controllers from "./controllers";

export default ({method, args}: { method: string, args: Object }) => {

    switch (method) {
        case "request:list": {
            return controllers.requests.list(args);
        }

        case "request:create": {
            return controllers.requests.create(args);
        }

        /* case "request:update": {
             return;
         }

         case "request:changeStatus": {
             return;
         }

         case "request:add": {
             return;
         }

         case "request:remove": {
             return;
         }*/
    }

}
