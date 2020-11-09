import { EntityRepository, Repository } from 'typeorm';

import Appointment from '../models/Appointment';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  public async findDate(date: Date): Promise<Appointment | null> {
    const findAppointment = await this.findOne({
      where: { date },
    });

    return findAppointment || null;
  }
}

export default AppointmentsRepository;

// import { isEqual } from 'date-fns';

// interface AppointmentDTO {
//   provider: string;
//   date: Date;
// }

// private appointments: Appointment[];

// constructor() {
//   this.appointments = [];
// }

// public all(): Appointment[] {
//   return this.appointments;
// }

// const findAppointment = this.appointments.find(appointment =>
//   isEqual(date, appointment.date),
// );

// public create({ provider, date }: AppointmentDTO): Appointment {
//   const appointment = new Appointment({ provider, date });
//   this.appointments.push(appointment);
//   return appointment;
// }
