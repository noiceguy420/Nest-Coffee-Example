import { Repository, DataSource } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './Entities/flavor.entity';
import { Coffee } from './Entities/coffee.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class CoffeeService {
    private readonly coffeeRepository;
    private readonly flavorRepository;
    private readonly datasource;
    constructor(coffeeRepository: Repository<Coffee>, flavorRepository: Repository<Flavor>, datasource: DataSource, coffeeBrands: string[]);
    findAll(paginationQueryDto: PaginationQueryDto): Promise<Coffee[]>;
    findOne(cid: string): Promise<Coffee>;
    create(createCoffeeDto: CreateCoffeeDto): Promise<Coffee>;
    update(id: string, updateCoffeeDto: UpdateCoffeeDto): Promise<Coffee>;
    remove(id: string): Promise<Coffee>;
    private preloadFlavorByName;
    reccomendCoffee(coffee: Coffee): Promise<void>;
}
