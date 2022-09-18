import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export default class ParseObjectId implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const id = new ObjectId(value);
    return id;
  }
}
