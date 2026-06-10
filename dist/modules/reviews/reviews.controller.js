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
exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reviews_service_1 = require("./reviews.service");
const dto_1 = require("./dto");
const guards_1 = require("../../common/guards");
const decorators_1 = require("../../common/decorators");
const dto_2 = require("../../common/dto");
let ReviewsController = class ReviewsController {
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    create(userId, dto) {
        return this.reviewsService.create(userId, dto);
    }
    findByHotel(hotelId, pagination) {
        return this.reviewsService.findByHotel(hotelId, pagination);
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.Post)('reviews'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a review for a hotel' }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateReviewDto]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('hotels/:hotelId/reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reviews for a hotel' }),
    __param(0, (0, common_1.Param)('hotelId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_2.PaginationDto]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "findByHotel", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, swagger_1.ApiTags)('Reviews'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], ReviewsController);
//# sourceMappingURL=reviews.controller.js.map