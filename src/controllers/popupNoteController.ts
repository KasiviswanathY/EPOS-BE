import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

export const getPopupNotes = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    const [popupNotes, total] = await Promise.all([
      prisma.popupNote.findMany({
        skip,
        take: pageSize,
        include: {
          category: true,
        },
      }),
      prisma.popupNote.count(),
    ]);

    res.status(200).json({
      data: popupNotes,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: ApiError | any) {
    console.error('Error fetching popup notes:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch popup notes',
    });
  }
};

export const getPopupNoteById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const popupNote = await prisma.popupNote.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!popupNote) {
      throw new ApiError({ message: 'PopupNote not found', statusCode: 404 });
    }

    res.status(200).json(popupNote);
  } catch (error: ApiError | any) {
    console.error('Error fetching popup note:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch popup note',
    });
  }
};

export const createPopupNote = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { name, message, showOncePerTransaction } = req.body;

    if (!name || !message) {
      throw new ApiError({
        message: 'Name and message are required fields',
        statusCode: 400,
      });
    }

    const popupNote = await prisma.popupNote.create({
      data: {
        name,
        message,
        showOncePerTransaction: showOncePerTransaction || false,
      },
    });

    res.status(201).json(popupNote);
  } catch (error: ApiError | any) {
    console.error('Error creating popup note:', error);
    res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to create popup note',
    });
  }
};

export const updatePopupNote = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const { name, message, showOncePerTransaction } = req.body;

    const popupNoteExists = await prisma.popupNote.findUnique({
      where: { id },
    });
    if (!popupNoteExists) {
      throw new ApiError({
        message: `PopupNote with ID ${id} not found`,
        statusCode: 404,
      });
    }

    const popupNote = await prisma.popupNote.update({
      where: { id },
      data: {
        name,
        message,
        showOncePerTransaction,
      },
    });

    res.status(200).json(popupNote);
  } catch (error: ApiError | any) {
    console.error('Error updating popup note:', error);
    res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to update popup note',
    });
  }
};

export const deletePopupNote = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const popupNoteExists = await prisma.popupNote.findUnique({
      where: { id },
    });

    if (!popupNoteExists) {
      throw new ApiError({
        message: `PopupNote with ID ${id} not found`,
        statusCode: 404,
      });
    }

    await prisma.popupNote.delete({ where: { id } });
    res.status(200).json({ message: 'PopupNote deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting popup note:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to delete popup note',
    });
  }
};
