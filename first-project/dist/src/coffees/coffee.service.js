"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoffeeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const flavor_entity_1 = require("./Entities/flavor.entity");
const coffee_entity_1 = require("./Entities/coffee.entity");
const events_entities_1 = require("../events/entities/events.entities");
const coffees_constants_1 = require("./coffees.constants");
let CoffeeService = class CoffeeService {
    coffeeRepository;
    flavorRepository;
    datasource;
    constructor(coffeeRepository, flavorRepository, datasource, coffeeBrands) {
        this.coffeeRepository = coffeeRepository;
        this.flavorRepository = flavorRepository;
        this.datasource = datasource;
        console.log(coffeeBrands);
    }
    findAll(paginationQueryDto) {
        const { limit, offset } = paginationQueryDto;
        return this.coffeeRepository.find({ relations: ['flavors'],
            skip: offset,
            take: limit
        });
    }
    async findOne(cid) {
        const coffee = await this.coffeeRepository.findOne({ where: { id: +cid }, relations: ['flavors'] });
        if (!coffee) {
            throw new common_1.NotFoundException(`Coffee #${cid} not found`);
        }
        return coffee;
    }
    async create(createCoffeeDto) {
        const flavors = await Promise.all(createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)));
        const coffee = this.coffeeRepository.create({ ...createCoffeeDto, flavors });
        return this.coffeeRepository.save(coffee);
    }
    async update(id, updateCoffeeDto) {
        const flavors = updateCoffeeDto.flavors && (await Promise.all(updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))));
        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors
        });
        if (!coffee) {
            throw new common_1.NotFoundException(`Coffee #${id} not found`);
        }
        return this.coffeeRepository.save(coffee);
    }
    async remove(id) {
        const coffee = await this.findOne(id);
        return this.coffeeRepository.remove(coffee);
    }
    async preloadFlavorByName(name) {
        const existingFlavor = await this.flavorRepository.findOneBy({ name: name });
        if (existingFlavor) {
            return existingFlavor;
        }
        return this.flavorRepository.create({ name });
    }
    async reccomendCoffee(coffee) {
        const queryRunner = this.datasource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            coffee.reccomandations++;
            const reccomandationEvent = new events_entities_1.Event();
            reccomandationEvent.name = 'reccomend_coffee';
            reccomandationEvent.type = 'coffee';
            reccomandationEvent.payload = { coffeeId: coffee.id };
            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(reccomandationEvent);
            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.CoffeeService = CoffeeService;
exports.CoffeeService = CoffeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(coffee_entity_1.Coffee)),
    __param(1, (0, typeorm_1.InjectRepository)(flavor_entity_1.Flavor)),
    __param(3, (0, common_1.Inject)(coffees_constants_1.coffee_brands)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource, Array])
], CoffeeService);
//# sourceMappingURL=coffee.service.js.map