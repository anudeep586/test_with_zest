import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table: Knex.TableBuilder) => {
        table.uuid('id').primary().notNullable().unique();
        table.string('username').notNullable();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.string('mobile').unique().nullable;
        table.string('address').nullable;
        table.string('profilePhotoLink',100000).nullable;
        table.string('websiteLink').nullable;
        table.string('githubLink').nullable;
        table.string('twitterLink').nullable;
        table.boolean('verified').notNullable();
        table.timestamp('created_at', { useTz: true });
        table.timestamp('updated_at', { useTz: true });
        table.string('type').nullable;
      })
}


export async function down(knex: Knex): Promise<void> {
}

