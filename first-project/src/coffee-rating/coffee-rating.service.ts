import { Injectable } from '@nestjs/common';
import { CoffeeService } from '../coffees/coffee.service';

@Injectable()
export class CoffeeRatingService {
    constructor(private readonly coffeeService: CoffeeService){}
}
