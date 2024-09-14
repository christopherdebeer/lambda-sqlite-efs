import * as cdk from "aws-cdk-lib";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import * as efs from "aws-cdk-lib/aws-efs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class LambdaSqliteEfsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = Vpc.fromLookup(this, "VPC", {
      isDefault: true,
    });
    // The code that defines your stack goes here

    const EFS_MOUNT_PATH = "/mnt/sqlite";

    const dataBaseEFS = new efs.FileSystem(this, "db-file-system", {
      vpc,
    });

    const accessPoint = dataBaseEFS.addAccessPoint("EfsAccessPoint", {
      createAcl: {
        ownerGid: "1001",
        ownerUid: "1001",
        permissions: "750",
      },
      path: "/lambda",
      posixUser: {
        gid: "1001",
        uid: "1001",
      },
    });

    new lambda.Function(this, "api-function", {
      vpc,
      filesystem: lambda.FileSystem.fromEfsAccessPoint(
        accessPoint,
        EFS_MOUNT_PATH
      ),
      environment: {
        MOUNT_PATH: EFS_MOUNT_PATH,
      },
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromInline(`export const handler = async (event) => { console.log("Hello World", { event })};`)
    });
  }
}
