//this file is for generation of dummy data
import {User} from '../src/entity/User.entity'
import UserRoles from "../src/enums/UserRoles";
import {DeepPartial} from "typeorm";
import Order from "../src/entity/Order.entity";
import Nomenclature from "../src/entity/Nomenclature.enity";
import OrderByNomenclature from "../src/entity/OrderByNomenclature.entity";
import StockBalance from "../src/entity/StockBalance.entity";
import Supplier from "../src/entity/Suppliers.entity";
import AppDataSource from "../src/dataSource";
import Client from '../src/entity/Client.entity';
import Replacement from "../src/entity/Replacement";
import Brands from "../src/enums/Brands";
import bcrypt from "bcrypt";


const users: DeepPartial<User>[] = [
    {
        id: 1,
        role: UserRoles.customer,
        access_granted: true,
        login: 'customer',
        password: '123',
        email: 'customer@test.test',
        telephone_number: '123',
        verified_email: true
    },
    {
        id: 2,
        role: UserRoles.admin,
        access_granted: true,
        login: 'admin',
        password: '123',
        email: 'admin@test.test',
        telephone_number: '123',
        verified_email: true
    },
    {
        id: 3,
        role: UserRoles.sales_manager,
        access_granted: true,
        login: 'sales_manager',
        password: '123qweasd',
        email: 'sales_manager@test.test',
        telephone_number: '123',
        verified_email: true
    },
    {
        id: 4,
        role: UserRoles.supply_manager,
        access_granted: true,
        login: 'supply_manager',
        password: '123qweasd',
        email: 'supply_manager@test.test',
        telephone_number: '123',
        verified_email: true,
        created_at: new Date(),
        updated_at: new Date
    },
    {
        id: 5,
        role: UserRoles.customer,
        access_granted: true,
        login: 'customer',
        password: '123',
        email: 'customer2@test.test',
        telephone_number: '123',
        verified_email: true
    },
]
const clients: DeepPartial<Client>[] = [
    {
        id: 1,
        user_id: 1,
        manager_id: 3
    },
    {
        id: 2,
        user_id: 5,
        manager_id: 3
    }
]

const orders: DeepPartial<Order>[] = []

const nomenclatures: DeepPartial<Nomenclature>[] = [
    {
        id: 1,
        part_number: 'ELM 327'
    },
    {
        id: 2,
        part_number: 'ELM 723'
    },
    {
        id: 3,
        part_number: 'Starship'
    },
    {
        id: 4,
        part_number: 'Falcon heavy'
    }

]

const orderByNomenclature: DeepPartial<OrderByNomenclature>[] = [

]

const suppliers: DeepPartial<Supplier>[] = [
    {
        id:1,
        manager_id: 4,
        name: 'someone'
    },
    {
        id:2,
        manager_id: 4,
        name: 'space X'
    }
]

const stockBalances :DeepPartial<StockBalance>[] = [
    {
        nomenclature_id: 1,
        supplier_id: 1,
        balance: 100,
        brand: Brands.origin,
        package: 'asd',
        manufactureDate: '11'
    },
    {
        nomenclature_id: 1,
        supplier_id: 2,
        balance: 100,
        brand: Brands.origin,
        package: 'asd',
        manufactureDate: '11'
    },
    {
        nomenclature_id: 2,
        supplier_id: 2,
        balance: 100,
        brand: Brands.origin,
        package: 'asd',
        manufactureDate: '11'
    },
    {
        nomenclature_id: 3,
        supplier_id: 2,
        balance: 100,
        brand: Brands.origin,
        package: 'asd',
        manufactureDate: '11'
    },{
        nomenclature_id: 4,
        supplier_id: 2,
        balance: 100,
        brand: Brands.origin,
        package: 'asd',
        manufactureDate: '11'
    },

]



const replacements: DeepPartial<Replacement>[] = [
    {
       nomenclature_id: 3,
       replacement_id: 4
    }
]


async function create() {
    await AppDataSource.initialize();

    for (let i= 0; i< users.length; i++ ) {
        const _user = User.create(users[i]);
        _user.password = await bcrypt.hash(_user.password, 10);
        try {
            await _user.save();
        }catch (e) {
            console.log(e)
        }
    }

    for (let i= 0; i< clients.length; i++ ) {
        const client = Client.create(clients[i]);
        try {
            await client.save();

        } catch (e) {
            console.log(e)

        }
    }



    for (let i= 0; i< nomenclatures.length; i++ ) {
        const nomenclature = Nomenclature.create(nomenclatures[i]);
        try {
            await nomenclature.save();
        }catch (e) {
            console.log(e)

        }
    }



    for (let i= 0; i< replacements.length; i++ ) {
        const replacement = Replacement.create(replacements[i]);
        try {
            await replacement.save();
        }catch (e) {
            console.log(e)

        }
    }

    for (let i= 0; i< suppliers.length; i++ ) {
        const supplier = Supplier.create(suppliers[i]);
        try {
            const savedSupplier = await supplier.save();
            for (let i= 0; i< stockBalances.length; i++ ) {
                const stock = stockBalances[i];
                stock.supplier_id = savedSupplier.id;
                const stockBalance = StockBalance.create(stock);
                try {
                    await stockBalance.save();
                }catch (e) {
                    console.log(e)
                }
            }
        }catch (e) {
            console.log(e)

        }
    }
    // const savedOrdersIDs = [];
    // for (let i= 0; i< orders.length; i++ ) {
    //     const order = Order.create(orders[i]);
    //     try {
    //         const _order = await order.save();
    //         savedOrdersIDs.push(_order.id);
    //     }catch (e) {
    //         console.log(e)
    //
    //     }
    // }
    //

    //
    // for (let i= 0; i< orderByNomenclature.length; i++ ) {
    //     orderByNomenclature[i].order_id = savedOrdersIDs[0];
    //     const _orderByNomenclature = OrderByNomenclature.create(orderByNomenclature[i]);
    //     try {
    //         await _orderByNomenclature.save();
    //     }catch (e) {
    //         console.log(e)
    //     }
    // }



    // for (let i= 0; i< suppliers.length; i++ ) {
    //     const supplier = Supplier.create(suppliers[i]);
    //     try {
    //         await supplier.save();
    //     }catch (e) {
    //         console.log(e)
    //
    //     }
    // }


    // for (let i= 0; i< stockBalances.length; i++ ) {
    //     const stockBalance = StockBalance.create(stockBalances[i]);
    //     try {
    //         await stockBalance.save();
    //     }catch (e) {
    //         console.log(e)
    //
    //     }
    // }


}

create().then(()=> {
    process.exit()
});