import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1582634713509 implements MigrationInterface {
    name = 'migration1582634713509'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "entry" ADD "siteAddress" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "entry" ADD "startDate" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "entry" ALTER COLUMN "point" DROP NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "entry" ALTER COLUMN "point" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "entry" DROP COLUMN "startDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "entry" DROP COLUMN "siteAddress"`, undefined);
    }

}
