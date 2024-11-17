import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { loginDto } from 'src/login/dto/login-dto.controller';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs/promises';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ){}

  async create(CreateUserDto:CreateUserDto){
    try{
      const {password, ...userData} = CreateUserDto;
      const newUser = this.userRepository.create({
        password: bcryptjs.hashSync(password,10),
      ...userData
      });
      await this.userRepository.save(newUser);
      const {password:_, ...user} = newUser
      return user;
    }catch(error){
      if(error.code==='23505'){
        throw new BadRequestException(`${CreateUserDto.email}already exists!!`);
      }
      throw new InternalServerErrorException('Something was wrong, please contact with support!');
    }
  }

  async login(loginDto: loginDto){
    const { email, password } = loginDto;

    //Busca el usuario por email
    const user  =  await this.userRepository.findOneBy({email})
    if(!user){
      throw new UnauthorizedException('Not valid credentials');
    }

    //Verifica la contraseña 
    if( !bcryptjs.compareSync(password, user.password)){
      throw new UnauthorizedException('Not valid credentials!';)
    }
    // Excluye la contraseña al devolver el usuario
    const { password:_, ...rest} =  user;
    const token = this.getJwtToken({id:user.id, email:user.email});
    return {
      user: rest,
      token: token
    }
    // Método para generar el token JWT
    
      //const payload = { sub: user.id, username: user.username }; // Ajusta los campos según tu entidad
      //return {
       // access_token:this.jwtService.signAsync(payload); // Genera el token
      //};
      private getJwtToken(payload: JwtPayload){
        const token = this.jwtService.sign(payload);
        return token;
      }
  }



  }


  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

