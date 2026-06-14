import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { CoffeeService } from './coffee.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class CoffeesController {
    private readonly coffeeService;
    constructor(coffeeService: CoffeeService);
    findAll(paginationQueryDto: PaginationQueryDto): Promise<import("./Entities/coffee.entity").Coffee[]>;
    findOne(id: string): Promise<import("./Entities/coffee.entity").Coffee>;
    create(createCoffeeDto: CreateCoffeeDto): Promise<import("./Entities/coffee.entity").Coffee>;
    update(id: string, updateCoffeeDto: UpdateCoffeeDto): Promise<import("./Entities/coffee.entity").Coffee>;
    remove(id: string): Promise<import("./Entities/coffee.entity").Coffee>;
}
