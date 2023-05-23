//this file is for generation of dummy data
import { User } from '../src/entity/User.entity'
import UserRoles from "../src/enums/UserRoles";
import bcrypt from "bcrypt";
import {DeepPartial} from "typeorm";
import Order from "../src/entity/Order.entity";
import OrderStatuses from "../src/enums/OrderStatuses";
import Nomenclature from "../src/entity/Nomenclature.enity";
import OrderByNomenclature from "../src/entity/OrderByNomenclature.entity";
import StockBalance from "../src/entity/StockBalance.entity";
import Supplier from "../src/entity/Suppliers.entity";
import AppDataSource from "../src/dataSource";
import Client from '../src/entity/Client.entity';
import Replacement from "../src/entity/Replacement";


const users: DeepPartial<User>[] = [
    {
        role: UserRoles.customer,
        access_granted: true,
        login: 'customer',
        password: '123qweasd',
        email: 'customer@test.test',
        country: 'Ukraine',
        telephone_number: '123',
        verified_email: true
    },
    {
        role: UserRoles.admin,
        access_granted: true,
        login: 'admin',
        password: '123qweasd',
        email: 'admin@test.test',
        country: 'Ukraine',
        telephone_number: '123',
        verified_email: true
    },
    {
        role: UserRoles.sales_manager,
        access_granted: true,
        login: 'sales_manager',
        password: '123qweasd',
        email: 'sales_manager@test.test',
        country: 'Ukraine',
        telephone_number: '123',
        verified_email: true
    },
    {
        role: UserRoles.supplier,
        access_granted: true,
        login: 'supplier',
        password: '123qweasd',
        email: 'supplier@test.test',
        country: 'Ukraine',
        telephone_number: '123',
        verified_email: true
    },
    {
        role: UserRoles.supply_manager,
        access_granted: true,
        login: 'supply_manager',
        password: '123qweasd',
        email: 'supply_manager@test.test',
        country: 'Ukraine',
        telephone_number: '123',
        verified_email: true,
        created_at: new Date(),
        updated_at: new Date
    }
]

const orders: DeepPartial<Order>[] = [
    {
        client_id: 1,
        status: OrderStatuses.created
    },
    {
        client_id: 1,
        status: OrderStatuses.cancelled
    },
    {
        client_id: 1,
        status: OrderStatuses.delivered
    },
    {
        client_id: 1,
        status: OrderStatuses.in_progress
    }
]

const nomenclatures: DeepPartial<Nomenclature>[] = [
    {
        part_number: '1'
    },
    {
        part_number: '2'
    },
    {
        part_number: '3'
    },
    {
        part_number: '4'
    },
    {
        part_number: '5'
    }
]

const orderByNomenclature: DeepPartial<OrderByNomenclature>[] = [
    {
        order_id:1,
        nomenclature_id: 1,
        quantity: 100,
        price: 12.213
    },
    {
        order_id:1,
        nomenclature_id: 2,
        quantity: 100,
        price: 12
    },
    {
        order_id:1,
        nomenclature_id: 3,
        quantity: 100,
        price: 1
    }
]

const suppliers: DeepPartial<Supplier>[] = [
    {
        manager_id: 5,
        name: 'asd'
    },
    {
        manager_id: 5,
        name: 'qwe'
    },
    {
        manager_id: 5,
        name: 'wer'
    }
]

const stockBalances :DeepPartial<StockBalance>[] = [
    {
        nomenclature_id: 1,
        supplier_id: 1,
        balance: 10
    },
    {
        nomenclature_id: 2,
        supplier_id: 1,
        balance: 10
    },
    {
        nomenclature_id: 3,
        supplier_id: 1,
        balance: 10
    },
    {
        nomenclature_id: 1,
        supplier_id: 2,
        balance: 10
    }
]

const clients: DeepPartial<Client>[] = [
    {
        user_id: 1,
        manager_id: 3,
        track_manager: false,
        check_delay: 0
    }
]

const replacements: DeepPartial<Replacement>[] = [
    {
        nomenclature_id: 1,
        replacement_id: 2
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

    for (let i= 0; i< orders.length; i++ ) {
        const order = Order.create(orders[i]);
        try {
            await order.save();
        }catch (e) {
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

    for (let i= 0; i< orderByNomenclature.length; i++ ) {
        const _orderByNomenclature = OrderByNomenclature.create(orderByNomenclature[i]);
        try {
            await _orderByNomenclature.save();
        }catch (e) {
            console.log(e)

        }
    }

    for (let i= 0; i< suppliers.length; i++ ) {
        const supplier = Supplier.create(suppliers[i]);
        try {
            await supplier.save();
        }catch (e) {
            console.log(e)

        }
    }

    // for (let i= 0; i< suppliers.length; i++ ) {
    //     const supplier = Supplier.create(suppliers[i]);
    //     try {
    //         await supplier.save();
    //     }catch (e) {
    //         console.log(e)
    //
    //     }
    // }


    for (let i= 0; i< stockBalances.length; i++ ) {
        const stockBalance = StockBalance.create(stockBalances[i]);
        try {
            await stockBalance.save();
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
}

create().then(()=> {
    process.exit()
});