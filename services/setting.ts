import { Setting } from '@prisma/client';
import { prisma } from '../prisma/db';

const findSettingById = async (id: number) => {
  return await prisma.setting.findUnique({
    where: {
      id,
    },
  });
};

const findSettingBySchoolId = async (schoolId: number) => {
  return await prisma.setting.findMany({
    where: {
      schoolId,
    },
  });
};

const findAllSettings = async () => {
  return await prisma.setting.findMany();
};

const createSetting = async (data: Setting) => {
  return await prisma.setting.create({
    data,
  });
};

const updateSetting = async (id: number, data: Setting) => {
  const existingSetting = await findSettingById(+id)
  if (!existingSetting) {
    throw new Error("Bad request, setting not found ...")
  }
  return await prisma.setting.update({
    where: {
      id,
    },
    data,
  });
};

const deleteSetting = async (id: number) => {
  const existingSetting = await findSettingById(+id)
  if (!existingSetting) {
    throw new Error("Bad request, setting not found ...")
  }
  return await prisma.setting.delete({
    where: {
      id,
    },
  });
};

export { findSettingById, findSettingBySchoolId, findAllSettings, createSetting, updateSetting, deleteSetting };
