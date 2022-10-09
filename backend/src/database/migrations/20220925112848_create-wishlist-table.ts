import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('wishlist', (table: Knex.TableBuilder) => {
        table.uuid('id').primary().notNullable().unique();
        table.uuid('userId').references('id').inTable('users').onUpdate('CASCADE') // If Article PK is changed, update FK as well.
        .onDelete('CASCADE')
        table.uuid('courseId').references('id').inTable('coursedetails').onUpdate('CASCADE') // If Article PK is changed, update FK as well.
        .onDelete('CASCADE')
      })
}


export async function down(knex: Knex): Promise<void> {
}

