import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './Entities/flavor.entity';
import { Coffee } from './Entities/coffee.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Event } from '../events/entities/events.entities';
import { coffee_brands } from './coffees.constants';

@Injectable()
export class CoffeeService {

    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly datasource: DataSource,
        //@Inject(coffee_brands) coffeeBrands: string[],
    ){}

    findAll(paginationQueryDto: PaginationQueryDto){
        const {limit, offset} = paginationQueryDto;
        return this.coffeeRepository.find({relations: ['flavors'],
            skip: offset,
            take:limit
        });
    }
    async findOne(cid: string) {
        const coffee = await this.coffeeRepository.findOne({where: {id: +cid}, relations: ['flavors']});
        if(!coffee){
            throw new NotFoundException(`Coffee #${cid} not found`);
        }
        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto){
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
        )

        const coffee = this.coffeeRepository.create({...createCoffeeDto, flavors});
        return this.coffeeRepository.save(coffee);
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto){
        const flavors = updateCoffeeDto.flavors && (
            await Promise.all(updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
            ))
            const coffee = await this.coffeeRepository.preload({
                id: +id,
                ...updateCoffeeDto,
                flavors
            });

        if(!coffee){
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return this.coffeeRepository.save(coffee);
    }

    async remove(id: string){
        const coffee = await this.findOne(id);
        return this.coffeeRepository.remove(coffee);
    }

    private async preloadFlavorByName(name: string): Promise<Flavor>{
        const existingFlavor = await this.flavorRepository.findOneBy({name: name});
        if(existingFlavor){
            return existingFlavor;
        }
        return this.flavorRepository.create({name});
    }

    async reccomendCoffee(coffee: Coffee) {
        const queryRunner = this.datasource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            coffee.reccomandations++;

            const reccomandationEvent = new Event();
            reccomandationEvent.name = 'reccomend_coffee';
            reccomandationEvent.type = 'coffee';
            reccomandationEvent.payload = {coffeeId: coffee.id};

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(reccomandationEvent);
            
            await queryRunner.commitTransaction();
        } catch(err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
}
