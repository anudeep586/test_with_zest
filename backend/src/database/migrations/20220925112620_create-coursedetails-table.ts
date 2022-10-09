import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('coursedetails', (table: Knex.TableBuilder) => {
        table.uuid('id').primary().notNullable().unique();
        table.uuid('userId').notNullable();
        table.string('coupon').nullable();
        table.string('price').nullable();
        table.string('title').nullable();
        table.string('categories').nullable();
        table.string('description',100000).nullable();
        table.string('imageUrl').nullable();
        table.integer('ratings').nullable();
        table.string('techStack',100000).nullable();
        table.timestamp('created_at', { useTz: true });
        table.timestamp('updated_at', { useTz: true });
      })
}


export async function down(knex: Knex): Promise<void> {
}

