import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('promocodes', (table: Knex.TableBuilder) => {
        table.uuid('id').primary().notNullable().unique();
        table.uuid('courseId').references('id').inTable('coursedetails').onUpdate('CASCADE') // If Article PK is changed, update FK as well.
        .onDelete('CASCADE')
        table.string('code').notNullable();
        table.date('created_at').notNullable();
        table.string('expirydate').notNullable();
        table.integer('percent').notNullable();
        table.integer('upto').notNullable();
        table.integer('min_order').notNullable();
      })
}


export async function down(knex: Knex): Promise<void> {
}

