import { Request, Response } from 'express';
import { prisma } from 'src/primsaClient';

export const getRoles = async (request: Request, response: Response) => {
  try {
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        permissions: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    response.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    response.status(500).json({ error: 'Error fetching roles' });
  }
};

export const createRole = async (request: Request, response: Response) => {
  try {
    const { name, description, permissions, type } = request.body;

    const newRole = await prisma.role.create({
      data: {
        name,
        type,
        description,
        permissions,
      },
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    response.status(201).json(newRole);
  } catch (error) {
    console.error('Error creating role:', error);
    response.status(500).json({ error: 'Error creating role' });
  }
};

export const getAllRoles = async (request: Request, response: Response) => {
  try {
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    response.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    response.status(500).json({ error: 'Error fetching roles' });
  }
};

export const getRoleById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    const role = await prisma.role.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!role) {
      response.status(404).json({ error: 'Role not found' });
      return;
    }

    response.status(200).json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    response.status(500).json({ error: 'Error fetching role' });
  }
};

export const updateRole = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const { name, description, permissions } = request.body;

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
        permissions,
      },
      select: {
        id: true,
        name: true,
        description: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    response.status(200).json(updatedRole);
  } catch (error) {
    console.error('Error updating role:', error);
    response.status(500).json({ error: 'Error updating role' });
  }
};

export const deleteRole = async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    const deletedRole = await prisma.role.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    response.status(200).json(deletedRole);
  } catch (error) {
    console.error('Error deleting role:', error);
    response.status(500).json({ error: 'Error deleting role' });
  }
};
