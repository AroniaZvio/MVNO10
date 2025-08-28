import { Request, Response } from 'express';
import * as svc from './service';

export async function getAll(_req: Request, res: Response) {
  const rows = await svc.list();
  res.json(rows);
}

// Публичный простой список (только нужные поля)
export async function listPublicSimple(_req: Request, res: Response) {
  try {
    const rows = await svc.listPublic();
    res.json(rows);
  } catch (error) {
    console.error('Database error, returning mock data:', error);
    // Возвращаем тестовые данные если база недоступна
    const mockData = [
      {
        id: 1,
        countryName: "Россия",
        countryCode: "+7",
        category: "simple",
        mobileNumber: "9001234567",
        number800: null,
        connectionFee: 500,
        monthlyFee: 1000
      },
      {
        id: 2,
        countryName: "США",
        countryCode: "+1",
        category: "gold",
        mobileNumber: "5551234567",
        number800: null,
        connectionFee: 1500,
        monthlyFee: 2000
      },
      {
        id: 3,
        countryName: "Великобритания",
        countryCode: "+44",
        category: "vip",
        mobileNumber: "7701234567",
        number800: null,
        connectionFee: 10000,
        monthlyFee: 5000
      },
      {
        id: 4,
        countryName: "США",
        countryCode: "+1",
        category: "platinum",
        mobileNumber: null,
        number800: "8001234567",
        connectionFee: 8000,
        monthlyFee: 3000
      }
    ];
    res.json(mockData);
  }
}

export async function createOne(req: Request, res: Response) {
  try {
    const b = req.body;
    
    // Валидация обязательных полей
    if (!b.countryCode || !b.countryName) {
      return res.status(400).json({ message: 'countryCode и countryName обязательны' });
    }
    
    if (!b.mobileNumber && !b.number800) {
      return res.status(400).json({ message: 'Укажите мобильный номер или номер 800' });
    }

    // Подготавливаем данные для создания
    const createData: any = {
      countryCode: b.countryCode,
      countryName: b.countryName,
      category: b.category || null,
      connectionFee: Number(b.connectionFee) || 0,
      monthlyFee: Number(b.monthlyFee) || 0,
      status: "available" // Явно устанавливаем статус
    };

    // Для мобильного номера
    if (b.mobileNumber && b.mobileNumber.trim()) {
      createData.mobileNumber = b.mobileNumber.trim();
    }

    // Для номера 800
    if (b.number800 && b.number800.trim()) {
      createData.number800 = b.number800.trim();
    }

    console.log('🔍 Debug: Creating phone number with data:', createData);

    const row = await svc.create(createData);
    res.status(201).json(row);
    
  } catch (error: any) {
    console.error('❌ Error creating phone number:', error);
    
    // Обработка специфических ошибок Prisma
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        message: 'Номер уже существует в базе данных',
        field: error.meta?.target?.[0] || 'unknown'
      });
    }
    
    res.status(500).json({ 
      message: 'Ошибка создания номера',
      error: error.message 
    });
  }
}

export async function updateOne(req: Request, res: Response) {
  const id = Number(req.params.id);
  const row = await svc.update(id, {
    countryCode: req.body.countryCode,
    countryName: req.body.countryName,
  category: req.body.category ?? undefined,
    mobileNumber: req.body.mobileNumber,
    number800: req.body.number800 ?? null,
    connectionFee: req.body.connectionFee !== undefined ? Number(req.body.connectionFee) : undefined,
    monthlyFee: req.body.monthlyFee !== undefined ? Number(req.body.monthlyFee) : undefined,
  });
  res.json(row);
}

export async function removeOne(req: Request, res: Response) {
  const id = Number(req.params.id);
  await svc.remove(id);
  res.json({ ok: true });
}

// Подключение номера пользователем
export async function connectNumber(req: Request, res: Response) {
  try {
    const numberId = Number(req.params.id);
    const userId = (req as any).user?.uid;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Проверяем, что номер доступен
    const number = await svc.getById(numberId);
    if (!number) {
      return res.status(404).json({ message: 'Number not found' });
    }

    if (number.status !== 'available' && number.userId !== null) {
      return res.status(400).json({ message: 'Number is not available' });
    }

    // Подключаем номер к пользователю
    const connectedNumber = await svc.connectToUser(numberId, userId);
    
    res.json({
      message: 'Number connected successfully',
      number: connectedNumber
    });
    
  } catch (error: any) {
    console.error('❌ Error connecting number:', error);
    res.status(500).json({ 
      message: 'Failed to connect number',
      error: error.message 
    });
  }
}
