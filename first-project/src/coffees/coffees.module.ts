import { Injectable, Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeeService } from './coffee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './Entities/coffee.entity';
import { Flavor } from './Entities/flavor.entity';
import { coffee_brands } from './coffees.constants';
import { DataSource } from 'typeorm';

class ConfigService{}
class productionConfigSevice{}
class DevelopmentConfigService{}

@Injectable()
export class coffeeBrandsFactory{
    create(){
        return ["buddy brew", "brew2"];
    }
}

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
    controllers: [CoffeesController],
    providers: [CoffeeService,
        //{provide: coffee_brands, useValue: ["buddy brew", "brew2"]},
        //{provide: ConfigService, useClass: process.env.NODE_ENV === 'development'? DevelopmentConfigService: productionConfigSevice}
        //{provide: coffee_brands, useFactory: () => ["buddy brew", "brew2"]}
        //coffeeBrandsFactory, {provide: coffee_brands, useFactory: (brandsFactory: coffeeBrandsFactory) => brandsFactory.create(), inject: [coffeeBrandsFactory]}
        /*{provide: coffee_brands, useFactory: async (datasource: DataSource): Promise<string[]> => {
            const coffeebrands = await Promise.resolve(["buddy brew", "brew2"]);
            return coffeebrands;
        }}*/
        ],
    exports: [CoffeeService]
})
export class CoffeesModule {}
