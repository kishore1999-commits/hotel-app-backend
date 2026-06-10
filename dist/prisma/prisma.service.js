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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
function buildClient() {
    return new client_1.PrismaClient().$extends((0, extension_accelerate_1.withAccelerate)());
}
let PrismaService = PrismaService_1 = class PrismaService {
    constructor() {
        this.logger = new common_1.Logger(PrismaService_1.name);
        this.$queryRaw = (...args) => this.client.$queryRaw(...args);
        this.$queryRawUnsafe = (...args) => this.client.$queryRawUnsafe(...args);
        this.$executeRaw = (...args) => this.client.$executeRaw(...args);
        this.$transaction = (...args) => this.client.$transaction(...args);
        this.client = buildClient();
    }
    async onModuleInit() {
        await this.client.$connect();
        this.logger.log('Database connected');
    }
    async onModuleDestroy() {
        await this.client.$disconnect();
        this.logger.log('Database disconnected');
    }
    get user() { return this.client.user; }
    get hotel() { return this.client.hotel; }
    get room() { return this.client.room; }
    get booking() { return this.client.booking; }
    get transaction() { return this.client.transaction; }
    get review() { return this.client.review; }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map