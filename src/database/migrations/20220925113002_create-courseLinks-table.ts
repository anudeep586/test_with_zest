import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('courseLinks', (table: Knex.TableBuilder) => {
        table.uuid('id').primary().notNullable().unique();
        table.uuid('courseId').references('id').inTable('coursedetails').onUpdate('CASCADE') // If Article PK is changed, update FK as well.
          .onDelete('CASCADE')
        table.string('trailerUrl',100000).nullable();
        table.string('superSubTitle').nullable();
        table.integer('index').nullable();
        table.integer('subIndex').nullable();
        table.string('subTitle').nullable();
        table.string('videoUrl',100000).nullable();
        table.integer('extrafileIndex').nullable();
        table.integer('extraLinksIndex').nullable();
        table.string('extrafileUrl',100000).nullable();
        table.string('extraLinksUrl',100000).nullable();
        })
}


export async function down(knex: Knex): Promise<void> {
}

