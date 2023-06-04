import dataSource from "../dataSource";
import Replacement from "../entity/Replacement";
import Client from "../entity/Client.entity";

const ClientsRepo = dataSource.getRepository(Client).extend({
    async getClientWithContractId(id:number) {
        const query = `
        SELECT
        client.*,
        contract.id as contract_id
        from 
        clients as client
        left join contracts as contract on contract.client_id = client.id
        where
        client.id = $1 
        `
        return await this.query(query, [id])
    }
})

export default ClientsRepo;