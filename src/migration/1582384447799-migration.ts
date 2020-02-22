import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1582384447799 implements MigrationInterface {
    name = 'migration1582384447799'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying, "phoneNumber" character varying NOT NULL, CONSTRAINT "UQ_3825121222d5c17741373d8ad13" UNIQUE ("email"), CONSTRAINT "UQ_1e68703b93fb4c02a2cef6003ca" UNIQUE ("phoneNumber"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "profile"`, undefined);
    }

}
