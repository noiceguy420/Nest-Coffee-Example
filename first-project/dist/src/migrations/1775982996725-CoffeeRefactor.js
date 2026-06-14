"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoffeeRefactor1775982996725 = void 0;
class CoffeeRefactor1775982996725 {
    async up(queryRunner) {
        await queryRunner.query(`alter table "coffee" rename column "name" to "title"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`alter table "coffee" rename column "title" to "name"`);
    }
}
exports.CoffeeRefactor1775982996725 = CoffeeRefactor1775982996725;
//# sourceMappingURL=1775982996725-CoffeeRefactor.js.map