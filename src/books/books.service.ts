import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
@Injectable()
export class BooksService {
  private readonly items: Book[] = [
    {
      id: '1',
      title: 'bebebbe',
      price: 750,
      isbn: '9780132350884',
      pageCount: 464,
      author: 'Vereshchain O.O.',
    },
    {
      id: '2',
      title: 'Potuzhno',
      price: 820,
      isbn: '9780135957059',
      pageCount: 352,
      author: 'Voloshyn T.R.',
    },
    {
      id: '3',
      title: 'bebe memebe',
      price: 900,
      isbn: '9780201633610',
      pageCount: 395,
      author: 'Neymet D.V.',
    },
  ];
  findAll(search?: string, limit?: number): Book[] {
    if (limit !== undefined && limit < 1) {
      throw new BadRequestException('limit must be a positive integer');
    }

    const query = search?.trim().toLowerCase();
    const result = query
      ? this.items.filter((b) => b.title.toLowerCase().includes(query))
      : this.items;

    return limit !== undefined ? result.slice(0, limit) : [...result];
  }
  findOne(id: string): Book {
    const book = this.items.find((b) => b.id === id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }
  create(dto: CreateBookDto): Book {
    this.assertIsbnUnique(dto.isbn);
    const book: Book = { id: randomUUID(), ...dto };
    this.items.push(book);
    return book;
  }

  update(id: string, dto: UpdateBookDto): Book {
    const book = this.findOne(id);
    if (dto.isbn) this.assertIsbnUnique(dto.isbn, id);
    const patch = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value != null),
    );
    return Object.assign(book, patch);
  }
  remove(id: string): void {
    const index = this.items.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    this.items.splice(index, 1);
  }
  private normalizeIsbn(isbn: string): string {
    return isbn.replace(/[-\s]/g, '').toUpperCase();
  }
  private assertIsbnUnique(isbn: string, excludeId?: string): void {
    const target = this.normalizeIsbn(isbn);
    const taken = this.items.some(
      (b) => b.id !== excludeId && this.normalizeIsbn(b.isbn) === target,
    );
    if (taken) {
      throw new ConflictException(`Book with ISBN ${isbn} already exists`);
    }
  }
}