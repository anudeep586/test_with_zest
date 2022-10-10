import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('comments', (table: Knex.TableBuilder) => {
        table.uuid('id').primary().notNullable().unique();
        table.uuid('courseId').references('id').inTable('coursedetails').onUpdate('CASCADE') // If Article PK is changed, update FK as well.
            .onDelete('CASCADE')
        table.uuid('userId').references('id').inTable('users').onUpdate('CASCADE') // If Article PK is changed, update FK as well.
            .onDelete('CASCADE')
        table.string('comment').nullable();
        table.string('parent_comment_id').nullable();
        table.timestamp('created_at', { useTz: true });
        table.timestamp('updated_at', { useTz: true });
        table.timestamp('deleted_at', { useTz: true });

    })
}


export async function down(knex: Knex): Promise<void> {
}

