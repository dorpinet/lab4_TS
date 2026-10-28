import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import type { Book } from './entities/book.entity';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @Header('X-API-Version', '1.0')
  @Header('X-Service-Status', 'operational')
  findAll(
    @Query('search') search?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Book[] {
    return this.booksService.findAll(search, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Book {
    return this.booksService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBookDto: CreateBookDto): Book {
    return this.booksService.create(createBookDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto): Book {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    this.booksService.remove(id);
  }
}