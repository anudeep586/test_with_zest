import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('ratings', (table: Knex.TableBuilder) => {
        table.uuid('id').primary().notNullable().unique();
        table.uuid('courseId').references('id').inTable('coursedetails').onUpdate('CASCADE') // If Article PK is changed, update FK as well.
            .onDelete('CASCADE')
        table.string('oneStar').nullable();
        table.string('twoStar').nullable();
        table.string('threeStar').nullable();
        table.string('fourStar').nullable();
        table.string('fiveStar').nullable();

    })
}


export async function down(knex: Knex): Promise<void> {
}

