import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoleName } from '@prisma/client';
import {
  Roles,
  RequirePermissions,
  CurrentUser,
  AuthenticatedUser,
} from '../../common/decorators';
import { RolesGuard, PermissionsGuard } from '../../common/guards';

export class CreateCourseDto {
  title: string;
  description: string;
}

@Controller('courses')
@UseGuards(RolesGuard, PermissionsGuard)
export class CoursesController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleName.TEACHER, RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @RequirePermissions('course.create')
  async createCourse(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    return {
      message: 'Course created successfully',
      course: {
        title: createCourseDto.title,
        description: createCourseDto.description,
        createdBy: user.id,
        creatorEmail: user.email,
        roles: user.roles,
      },
    };
  }

  @Get()
  @Roles(RoleName.STUDENT, RoleName.TEACHER, RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @RequirePermissions('course.read')
  async listCourses(@CurrentUser('id') userId: string) {
    return {
      message: 'Courses retrieved successfully',
      requestedBy: userId,
      courses: [],
    };
  }
}
